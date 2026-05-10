'use client';

import { PlayersProps } from '@/types';
import { HandlerType } from '@/types/component';
import VaulDrawer from '@/components/ui/overlay/VaulDrawer';
import SelectButton from '@/components/ui/input/SelectButton';
import { Ads, Clock, Rocket, Star } from '@/utils/icons';

interface MoviePlayerSourceSelectionProps extends HandlerType {
  players: PlayersProps[];
  selectedSource: number;
  setSelectedSource: (source: number) => void;
}

const MoviePlayerSourceSelection: React.FC<MoviePlayerSourceSelectionProps> = ({
  opened,
  onClose,
  players,
  selectedSource,
  setSelectedSource,
}) => {
  return (
    <VaulDrawer
      open={opened}
      onOpenChange={(v: boolean) => { if (!v) onClose(); }}
      backdrop="blur"
      title="Select Source"
      direction="right"
      hiddenHandler
      withCloseButton
      classNames={{ content: 'space-y-0' }}
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="space-y-2 px-1 py-2">
          <div className="flex items-center gap-2"><Star className="text-warning" /><span className="text-sm">Recommended</span></div>
          <div className="flex items-center gap-2"><Rocket className="text-danger" /><span className="text-sm">Fast hosting</span></div>
          <div className="flex items-center gap-2"><Clock className="text-success" /><span className="text-sm">Watch Progress Support</span></div>
          <div className="flex items-center gap-2"><Ads className="text-primary" /><span className="text-sm">May contain popup ads</span></div>
        </div>
        <SelectButton
          color="primary"
          groupType="list"
          value={selectedSource.toString()}
          onChange={(value) => {
            setSelectedSource(Number(value || 0));
            onClose();
          }}
          data={players.map(({ title, recommended, fast, ads, resumable }, index) => ({
            label: title,
            value: index.toString(),
            endContent: (
              <div key={`info-${title}`} className="flex flex-wrap items-center gap-2">
                {recommended && <Star className="text-warning" />}
                {fast && <Rocket className="text-danger" />}
                {resumable && <Clock className="text-success" />}
                {ads && <Ads className="text-primary" />}
              </div>
            ),
          }))}
        />
      </div>
    </VaulDrawer>
  );
};

export default MoviePlayerSourceSelection;
